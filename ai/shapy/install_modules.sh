# attributes 모듈 설정
export PYTHONPATH=$PYTHONPATH:$(pwd)/attributes/
cd attributes
python setup.py install

# mesh-mesh-intersection 모듈 설정
cd ../mesh-mesh-intersection
export CUDA_SAMPLES_INC=$(pwd)/include
pip install -r requirements.txt
python setup.py install