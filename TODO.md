# TODO: Implement Image Upload Service for QR Updates

## Tasks
- [ ] Add uploadImagesToSupabase function in qrs.service.js to handle multiple image uploads to Supabase
- [ ] Add updateQrWithImages service function to update QR record with image URLs and keys
- [ ] Add updateQrImagesController in qrs.controller.js to handle the API request
- [ ] Add PUT route /qrs/:code/images in qrs.router.js with multer middleware for multiple files
- [ ] Test the implementation
