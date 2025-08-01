package com.scm.services.impl;

import java.io.IOException;
// import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import com.scm.helper.AppConstant;
import com.scm.services.imageService;

@Service
public class imageServiceImpl implements imageService {

    private Cloudinary cloudinary;
    
    public imageServiceImpl(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
        }



    @Override
    public String uploadImage(MultipartFile contactImage, String filename) {
        // Code for image upload
        

        try{
            byte[] data=new byte[contactImage.getInputStream().available()];
            contactImage.getInputStream().read(data);
            cloudinary.uploader().upload(data, ObjectUtils.asMap(
                "public_id", filename)
            );

            return this.getUrlFromPublicId(filename);

        }
        catch(IOException e){
            e.printStackTrace();
            return null;
        }
        // and it will return url
        // Wecan use AWS but we will user cloudinary

        
    }



    @Override
    public String getUrlFromPublicId(String publicId) {
        // TODO Auto-generated method stub
        return cloudinary
        .url()
        .transformation(
            new Transformation<>()
            .width(AppConstant.CONTACT_IMAGE_WIDTH)
            .height(AppConstant.CONTACT_IMAGE_HEIGHT)
            .crop(AppConstant.CONTACT_IMAGE_CROP)
        )
        .generate(publicId);
    }


}
