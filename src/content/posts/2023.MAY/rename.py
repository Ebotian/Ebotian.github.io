import os
import re

def rename_markdown_files(directory):
    # 正则表达式匹配Markdown文件
    markdown_pattern = re.compile(r'\.md$', re.IGNORECASE)

    # 遍历目录中的所有文件
    for filename in os.listdir(directory):
        if markdown_pattern.search(filename):
            # 为每个Markdown文件生成新的文件名
            for day in range(1, 32):
                new_filename = f"2023-05-{day:02d}-{filename}"
                # 构造原始和新的完整文件路径
                original_path = os.path.join(directory, filename)
                new_path = os.path.join(directory, new_filename)
                # 重命名文件
                os.rename(original_path, new_path)
                # 由于文件已被重命名，跳出循环以避免重复处理
                break

# 调用函数，这里的'./'表示当前目录，根据需要修改
rename_markdown_files('./')