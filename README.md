# instagram-video-upload-using-node-js
The complete setup for video upload on instagram with all required specifications

INSTALLATION: 
1. clone the repo.
2. run npm i to install required packages.
3. run npm start to run the server

USES:
I am a platform who allows others to add videos on my platform and those vidoes are live for bidding after there bidding time finishes you want to market those videos which are not 
sold then this is good. It can used to automatically upload the video which are not sold on instagram or the highlights of that video.

WHAT I HAVE USED IN THIS: 
1. Node JS
2. Multer for file upload
3. ffmpeg for instagram video requirements
4. also you have to install ffmpeg files and set path on your server

INSTAGRAM REQUIRED VIDEO SPECIFICATIONS COVERED: 
1.Container: MOV or MP4 (MPEG-4 Part 14), no edit lists, moov atom at the front of the file.
2.Audio codec: AAC, 48khz sample rate maximum, 1 or 2 channels (mono or stereo).
3.Video codec: HEVC or H264, progressive scan, closed GOP, 4:2:0 chroma subsampling.
4.Frame rate: 23-60 FPS.
5.Picture size:
  Maximum columns (horizontal pixels): 1920
  Minimum aspect ratio [cols / rows]: 4 / 5
  Maximum aspect ratio [cols / rows]: 16 / 9
6.Video bitrate: VBR, 25Mbps maximum
7.Audio bitrate: 128kbps
8.Duration: 60 seconds maximum, 3 seconds minimum
9.File size: 100MB maximum

WORKING: 
It has an api endpoint which is created for user to upload the video to server that video will be modified according to instagram requirements and then you can post that video by giving url
of the video to insta upload api
you need to setup your facebook developer account for this first to get access token, your insta page id.

A BASIC FRONTEND CODE TO CHECK THE WORKING IF YOU WANT TO TEST IT:

HTML:
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MP4 Video Upload</title>
</head>
<body>
    <h1>Upload MP4 Video</h1>
    <form id="uploadForm" enctype="multipart/form-data">
        <input type="file" name="video" accept="video/mp4">
        <button type="submit">Upload</button>
    </form>

    <div id="message"></div>

    <script src="profilepic.js"></script>
</body>
</html>


JAVASCRIPT:

const uploadForm = document.getElementById('uploadForm');
const messageDiv = document.getElementById('message');

uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(uploadForm);

    fetch('http://localhost:8081/data/upload', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            // Display the upload message
            messageDiv.innerHTML = data.message;

            // Clear the file input
            uploadForm.reset();
        })
        .catch(error => {
            messageDiv.innerHTML = 'An error occurred while uploading the file.';
            console.error(error);
        });
});
