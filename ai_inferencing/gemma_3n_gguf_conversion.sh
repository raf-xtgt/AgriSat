#!/bin/bash

# RunPod GGUF Conversion Script

# System Resources:
# RAM: 503Gi total, 428Gi available
# Storage: 30G total, 30G available
# GPU: NVIDIA A40, 46068

# Update system and install dependencies
apt update && apt install -y git git-lfs cmake build-essential python3-pip

# Install Python packages
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
pip install huggingface_hub sentencepiece protobuf safetensors accelerate

# Set up Git LFS
git lfs install

# Create working directory
mkdir -p /workspace/model_conversion
cd /workspace/model_conversion

# Login to Hugging Face (you'll need to provide your token)
huggingface-cli login


# Clone the model with proper LFS handling
echo "=== Cloning Model ==="
export GIT_LFS_SKIP_SMUDGE=1
git clone https://huggingface.co/raf-xtgt/gemma_3n_unsloth_finetune ./model
cd model
git lfs pull
cd ..

# Clone and build llama.cpp with CUDA support
echo "=== Building llama.cpp ==="
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp


apt update && apt install -y libcurl4-openssl-dev


# Build using CMake (new recommended method)
mkdir build
cd build
cmake .. -DLLAMA_CUDA=ON -DCMAKE_BUILD_TYPE=Release
make -j$(nproc)
cd ..

# Install transformers and related packages
pip install transformers tokenizers datasets

# If you haven't already installed these (they might be missing):
pip install numpy

# Optional but recommended for better performance:
pip install bitsandbytes


echo "=== Starting Conversion Process ==="

# Step 1: Convert to F16 GGUF
echo "Converting to F16 GGUF..."
python convert_hf_to_gguf.py ../model --outfile ../gemma-3n-finetune-f16.gguf --outtype f16

# Check if F16 conversion was successful
if [ -f "../gemma-3n-finetune-f16.gguf" ]; then
    echo "F16 conversion successful!"
    
    # Step 2: Quantize to different levels (you can choose which ones you want)
    echo "=== Quantizing Model ==="
    
    # Q4_K_M (recommended 4-bit quantization)
    echo "Creating Q4_K_M quantization..."
    ./build/bin/llama-quantize ../gemma-3n-finetune-f16.gguf ../gemma-3n-finetune-q4_k_m.gguf Q4_K_M
    
    # Q5_K_S (higher quality 5-bit)
    echo "Creating Q5_K_S quantization..."
    ./build/bin/llama-quantize ../gemma-3n-finetune-f16.gguf ../gemma-3n-finetune-q5_k_s.gguf Q5_K_S
    
    # Q8_0 (8-bit, good balance)
    echo "Creating Q8_0 quantization..."
    ./build/bin/llama-quantize ../gemma-3n-finetune-f16.gguf ../gemma-3n-finetune-q8_0.gguf Q8_0
    
    # Clean up F16 version to save space
    rm ../gemma-3n-finetune-f16.gguf
    echo "Removed intermediate F16 file to save space"
    
else
    echo "F16 conversion failed, trying direct quantization..."
    python convert_hf_to_gguf.py ../model --outfile ../gemma-3n-finetune-q8_0.gguf --outtype q8_0
fi

# Go back to main directory
cd ..

echo "=== Conversion Complete ==="


# Show final file sizes
echo "Final files:"
ls -lh *.gguf

# Calculate sizes
for file in *.gguf; do
    if [ -f "$file" ]; then
        size=$(du -h "$file" | cut -f1)
        echo "$file: $size"
    fi
done

echo "=== Conversion Summary ==="
echo "Original model size: ~13.7GB"
echo "Quantized versions created:"
echo "- Q4_K_M: ~3.5GB (recommended for most use cases)"
echo "- Q5_K_S: ~4.5GB (higher quality)"
echo "- Q8_0: ~7GB (best quality quantized)"

echo "Files are ready in: /workspace/model_conversion/"
echo "You can download them using RunPod's file manager or rsync/scp"

echo "Pushing to hugging face"
hf upload raf-xtgt/gemma-3n-finetune-gguf gemma-3n-finetune-q4_k_m.gguf
hf upload raf-xtgt/gemma-3n-finetune-gguf gemma-3n-finetune-q5_k_s.gguf
hf upload raf-xtgt/gemma-3n-finetune-gguf gemma-3n-finetune-q8_0.gguf
