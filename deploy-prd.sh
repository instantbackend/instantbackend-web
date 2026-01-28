#!/usr/bin/env bash
npm run build
aws s3 sync out/ s3://backendflow-web-366009355111-eu-west-1 --profile gitgui
aws cloudfront create-invalidation --distribution-id E1AVB5JRIICA4Z --paths "/*" --profile gitgui