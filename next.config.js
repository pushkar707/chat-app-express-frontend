/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        dangerouslyAllowSVG: true,
        remotePatterns:[
            {
                hostname: "static.vecteezy.com"
            },
            {
                hostname:"chat-app-files-pushkar.s3.ap-south-1.amazonaws.com"
            },
            {
                hostname: "img.icons8.com/"
            }
        ]
    },
    
}

module.exports = nextConfig
