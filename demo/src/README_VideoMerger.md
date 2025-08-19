# 视频合并器 (VideoMerger)

## 功能描述

这个 Java 程序可以读取指定目录下的 `.ts` 视频文件，按文件名排序，然后将它们合并成一个高清流畅的 MP4 视频文件。

## 主要特性

- 🎥 自动扫描指定目录下的 `.ts` 文件
- 📁 按文件名排序，确保视频顺序正确
- 🔄 使用 FFmpeg 进行高质量视频合并
- 💾 自动清理临时文件
- 📊 显示详细的处理进度和文件信息

## 系统要求

### 必需软件
1. **Java 8 或更高版本**
2. **FFmpeg** - 视频处理工具

### FFmpeg 安装方法

#### Windows 用户
1. 访问 [FFmpeg 官网](https://ffmpeg.org/download.html)
2. 下载 Windows 版本
3. 解压到任意目录（如 `C:\ffmpeg`）
4. 将 `C:\ffmpeg\bin` 添加到系统环境变量 PATH 中

#### 验证安装
打开命令提示符，输入：
```bash
ffmpeg -version
```
如果显示版本信息，说明安装成功。

## 使用方法

### 1. 编译 Java 文件
```bash
javac VideoMerger.java
```

### 2. 运行程序
```bash
java VideoMerger
```

### 3. 程序会自动：
- 扫描 `C:\Users\zkw07\Desktop\sp` 目录
- 查找所有 `.ts` 文件
- 按文件名排序
- 合并视频到 `C:\Users\zkw07\Desktop\merged_video.mp4`

## 配置说明

### 修改路径配置
在 `VideoMerger.java` 文件中，可以修改以下常量：

```java
// 视频源目录
private static final String VIDEO_DIRECTORY = "C:\\Users\\zkw07\\Desktop\\sp";

// 输出视频文件路径
private static final String OUTPUT_VIDEO_PATH = "C:\\Users\\zkw07\\Desktop\\merged_video.mp4";

// 临时文件目录
private static final String TEMP_DIRECTORY = "C:\\Users\\zkw07\\Desktop\\temp_videos";
```

### 视频质量设置
程序使用以下 FFmpeg 参数确保高质量输出：

```java
// 视频编码：H.264，高质量预设
"-c:v", "libx264",
"-preset", "slow",     // 慢速编码，质量更好
"-crf", "18",          // 恒定质量因子，18表示高质量

// 音频编码：AAC，192kbps
"-c:a", "aac",
"-b:a", "192k",
```

## 输出说明

### 控制台输出
程序运行时会显示：
- 找到的 `.ts` 文件数量和列表
- 文件大小信息
- FFmpeg 执行过程
- 处理结果

### 输出文件
- **合并后的视频**：`merged_video.mp4`
- **临时文件**：自动创建和清理

## 注意事项

### 1. 文件命名
- 确保 `.ts` 文件按正确顺序命名
- 建议使用数字前缀，如：`01.ts`, `02.ts`, `03.ts`

### 2. 磁盘空间
- 确保有足够的磁盘空间存储合并后的视频
- 临时文件会占用额外空间

### 3. 处理时间
- 视频合并时间取决于文件大小和数量
- 使用高质量编码会增加处理时间

### 4. 文件格式
- 输入文件必须是 `.ts` 格式
- 输出文件为 `.mp4` 格式

## 故障排除

### 常见问题

#### 1. "FFmpeg 执行失败"
- 检查 FFmpeg 是否正确安装
- 确认环境变量 PATH 设置正确
- 在命令行中测试 `ffmpeg -version`

#### 2. "视频目录不存在"
- 检查 `VIDEO_DIRECTORY` 路径是否正确
- 确认目录确实存在

#### 3. "未找到.ts文件"
- 确认目录中有 `.ts` 文件
- 检查文件扩展名是否正确

#### 4. 内存不足
- 对于大文件，可能需要增加 JVM 堆内存
- 使用 `java -Xmx4g VideoMerger` 设置最大堆内存为 4GB

## 技术原理

### 1. 文件扫描
使用 Java NIO.2 API 递归扫描目录，过滤 `.ts` 文件。

### 2. 文件排序
按文件名进行字典序排序，确保视频片段顺序正确。

### 3. 视频合并
使用 FFmpeg 的 concat demuxer 功能：
- 创建文件列表
- 使用 concat 格式合并
- 保持原始视频质量

### 4. 编码优化
- H.264 视频编码，平衡质量和文件大小
- AAC 音频编码，确保音频质量
- 优化网络播放的元数据

## 许可证

MIT License - 可自由使用和修改。

## 作者

VideoMerger v1.0
