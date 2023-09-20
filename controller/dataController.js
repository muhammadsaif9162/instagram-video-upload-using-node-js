const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const uploadAndPublishVideo = require('../utils/instaVideo');

ffmpeg.setFfmpegPath('C:\\PATH_programs\\ffmpeg.exe'); // Replace with your actual path

// Storage configuration for adding video and its different form components
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let destinationPath = './uploads';
        cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const originalname = file.originalname;
        const filename = `${timestamp}-${originalname}`;
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'video/mp4') {
        cb(null, true);
    } else {
        cb(new Error('Only MP4 files are allowed'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post('/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const inputFilePath = path.join(__dirname, '..', req.file.path);
    const outputDirectory = path.join(__dirname, '..', 'uploads');
    const outputFilePath = path.join(outputDirectory, req.file.filename);
    const temporaryOutputFilePath = path.join(outputDirectory, 'temp_' + req.file.filename);

    const command = ffmpeg({ source: inputFilePath })
        .setStartTime('00:00:00')
        .setDuration('59')
        .audioBitrate('128k')
        .videoBitrate('10000k') // Adjust the video bitrate based on the target file size and duration
        .videoCodec('libx264')
        .audioCodec('aac')
        .audioFrequency(48000)
        .audioChannels(2)
        .fps(23)
        .videoFilters('format=yuv420p')
        .setAspect('4:5') // Minimum aspect ratio
        .setAspect('16:9') // Maximum aspect ratio
        .size('1280x720')
        .output(temporaryOutputFilePath) // Save to a temporary file
        .on('start', (commandLine) => {
            console.log('FFmpeg command:', commandLine);
        })
        .on('progress', (progress) => {
            // Log the progress information
            console.log(`Processing: ${progress.percent}% done`);
        })
        .on('end', () => {
            // Handle success
            console.log('Video trimmed successfully');

            // Rename the temporary file to replace the original video
            fs.rename(temporaryOutputFilePath, outputFilePath, (err) => {
                if (err) {
                    console.error('Error renaming file:', err);
                    return res.status(500).json({ message: 'An error occurred while renaming the file' });
                }

                return res.json({ message: 'MP4 video file uploaded and trimmed successfully', fileName: req.file.filename });
            });
        })
        .on('error', (err, stdout, stderr) => {
            // Handle errors gracefully
            console.error('Error processing video:', err);
            console.error('FFmpeg stdout:', stdout);
            console.error('FFmpeg stderr:', stderr);
            return res.status(500).json({ message: 'An error occurred during video processing', error: err.message });
        })
        .run();
});

router.post('/insta', uploadAndPublishVideo)

module.exports = router