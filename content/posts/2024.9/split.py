import os

def split_file(input_file, output_dir):
    # 确保输出目录存在
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    with open(input_file, 'r', encoding='utf-8') as file:
        content = file.read()

    # 以空行分割内容
    sections = content.split('\n\n')

    # 为每个部分创建一个新的 Markdown 文件
    for i, section in enumerate(sections, 1):
        if section.strip():  # 忽略空部分
            output_file = os.path.join(output_dir, f'大学随笔第4本{i:02d}页.md')
            with open(output_file, 'w', encoding='utf-8') as file:
                file.write(section.strip() + '\n')

    print(f"拆分完成。共创建了 {i} 个文件。")

# 使用示例
input_file = '大学随笔第4本.md'  # 替换为您的输入文件名
output_dir = '大学随笔第4本'    # 替换为您想要的输出目录名

split_file(input_file, output_dir)