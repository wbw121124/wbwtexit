# # 设置UCRT64环境
# export MSYSTEM=UCRT64
# export MSYS2_PATH_TYPE=inherit
# export PATH="/ucrt64/bin:/usr/bin:${PATH}"

# # 重新加载环境
# source /etc/profile

# 添加到 ~/.bashrc 或 ~/.bash_profile
ucrt64() {
    export MSYSTEM=UCRT64
    export MSYS2_PATH_TYPE=inherit
    export PATH="/home/yl/bin:/ucrt64/bin:/usr/local/bin:/usr/bin:/bin:/c/Windows/System32:/c/Windows:/c/Windows/System32/Wbem:/c/Windows/System32/WindowsPowerShell/v1.0/:/usr/bin/site_perl:/usr/bin/vendor_perl:/usr/bin/core_perl:/ucrt64/bin:/usr/bin:${PATH}"
    source /etc/profile
    echo "Switched to UCRT64 environment"
}

# source ./swap_to_ucrt64.sh
# ucrt64