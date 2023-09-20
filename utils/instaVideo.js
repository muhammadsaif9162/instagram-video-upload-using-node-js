const axios = require('axios');

const user_id = '17841461607725096';
const accessToken = 'EAAMVmC5sl6QBOxfhqvyg9yzRPUgqFyxVAWQvchGlmhvZBBY1ZC4JiQUJzwaMoby2OA7TcaYB3WTJsZBDbuBtwddQoNZC7ZBC47SyJIHn1QGG0VuY1jNkacj1JpETnndevMjgEugXCZCoYSRjIKdbTkvuBZByHCz4dNY8Vex4xEaUwa0ik0qJOKUYFR3ToLFHIhD';
const video_url = 'https://glokalstv.com/private-glokals-highlights/1695168169656-cat.mp4';

const createVideoContainer = async () => {
    try {
        const videoContainerParams = {
            caption: 'This is the caption of testing insta upload api',
            video_url: video_url,
            media_type: 'VIDEO',
            thumb_offset: 1000
        };

        const response = await axios.post(`https://graph.facebook.com/v18.0/${user_id}/media`, {
            access_token: accessToken,
            ...videoContainerParams
        });

        const videoContainer = response.data;
        const videoContainerId = videoContainer.id;
        console.log(videoContainerId);
        return videoContainerId;
    } catch (error) {
        console.error('Error creating video container:', error);
        throw error;
    }
};

const publishVideoContainer = async (videoContainerId) => {
    try {
        const containerStatusCode = '';

        while (containerStatusCode !== 'FINISHED') {
            const response = await axios.get(`https://graph.facebook.com/v18.0/${videoContainerId}`, {
                params: {
                    fields: 'status, status_code',
                    access_token: accessToken
                }
            });

            const containerInfo = response.data;
            const containerStatusCode = containerInfo.status_code;
            console.log(containerInfo);
            console.log(containerStatusCode);

            if (containerStatusCode === 'FINISHED') {
                const mediaPublishParams = {
                    creation_id: videoContainerId
                };

                const mediaPublishResponse = await axios.post(`https://graph.facebook.com/v18.0/${user_id}/media_publish`, {
                    access_token: accessToken,
                    ...mediaPublishParams
                });

                const publishedPost = mediaPublishResponse.data;
                console.log('Video published:', publishedPost);
                return true
            }

            if (containerStatusCode === 'ERROR') {
                // Break the loop when an error occurs
                return false
            }

            await new Promise(resolve => setTimeout(resolve, 1000)); // Sleep for 1 second
        }
    } catch (error) {
        console.error('Error publishing video container:', error);
        throw error;
    }
};

// Main function to upload and publish the video container
const uploadAndPublishVideo = async (req, res) => {
    try {
        const videoContainerId = await createVideoContainer();
        const status_of_upload = await publishVideoContainer(videoContainerId);
        return res.json({ status_of_upload })
    } catch (error) {
        console.error('Error uploading and publishing video:', error);
    }
};

module.exports = uploadAndPublishVideo