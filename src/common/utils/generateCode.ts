/**
 * 生成随机6位数字
 */
export default function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}