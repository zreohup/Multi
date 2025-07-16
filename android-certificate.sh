#!/bin/bash

echo "🔐 Android证书申请脚本"
echo "======================"

# 生成keystore
keytool -genkey -v -keystore safe-wallet.keystore -alias safe-wallet -keyalg RSA -keysize 2048 -validity 10000

echo "✅ 证书生成完成"
echo "📝 请将safe-wallet.keystore文件保存到安全位置"
echo "🔑 请记住您设置的密码，用于后续签名"
