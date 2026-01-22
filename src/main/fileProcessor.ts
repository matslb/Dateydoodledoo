import { promises as fs } from 'fs';
import path from 'path';
import piexif, { ExifObject } from 'piexifjs';
import { format } from 'date-fns';
import { FileInfo, ProcessResult } from '../shared/types.js';

export const modifyExifDate = async (
  filePath: string,
  date: Date
): Promise<boolean> => {
  try {
    // Read the file
    const fileBuffer = await fs.readFile(filePath);
    const fileData = fileBuffer.toString('binary');
    
    // Format date for EXIF (YYYY:MM:DD HH:MM:SS)
    const exifDate = format(date, 'yyyy:MM:dd HH:mm:ss');
    
    let exifObj: ExifObject;
    
    try {
      // Try to read existing EXIF
      exifObj = piexif.load(fileData);
    } catch {
      // If no EXIF exists, create new structure
      exifObj = {
        '0th': {},
        'Exif': {},
        'GPS': {},
        '1st': {},
        'thumbnail': null,
      };
    }
    
    // Update date fields
    if (!exifObj['0th']) exifObj['0th'] = {};
    if (!exifObj['Exif']) exifObj['Exif'] = {};
    
    exifObj['0th'][piexif.ImageIFD.DateTime] = exifDate;
    exifObj['Exif'][piexif.ExifIFD.DateTimeOriginal] = exifDate;
    exifObj['Exif'][piexif.ExifIFD.DateTimeDigitized] = exifDate;
    
    // Convert back to binary
    const exifBytes = piexif.dump(exifObj);
    const newFileData = piexif.insert(exifBytes, fileData);
    
    // Write back to file
    await fs.writeFile(filePath, Buffer.from(newFileData, 'binary'));
    
    return true;
  } catch (error) {
    console.error(`Error modifying EXIF for ${filePath}:`, error);
    return false;
  }
};

export const organizeFiles = async (
  files: FileInfo[],
  date: Date,
  rootPath: string,
  deleteOriginals: boolean
): Promise<ProcessResult> => {
  let processedCount = 0;
  let errorCount = 0;
  const errors: string[] = [];
  
  if (!rootPath) {
    return {
      success: false,
      message: 'Root destination folder is not set',
      processedCount: 0,
      errorCount: files.length,
    };
  }
  
  // Create year and month folders
  const year = format(date, 'yyyy');
  const month = format(date, 'MM');
  const destinationDir = path.join(rootPath, year, month);
  
  try {
    // Ensure destination directory exists
    await fs.mkdir(destinationDir, { recursive: true });
  } catch (error) {
    return {
      success: false,
      message: `Failed to create destination directory: ${error}`,
      processedCount: 0,
      errorCount: files.length,
    };
  }
  
  for (const file of files) {
    try {
      // Modify EXIF date
      const exifSuccess = await modifyExifDate(file.path, date);
      if (!exifSuccess) {
        console.warn(`Failed to modify EXIF for ${file.name}, continuing...`);
      }
      
      // Determine destination path
      let destinationPath = path.join(destinationDir, file.name);
      
      // Handle duplicate filenames
      let counter = 1;
      const ext = path.extname(file.name);
      const baseName = path.basename(file.name, ext);
      
      while (await fileExists(destinationPath)) {
        const newName = `${baseName}_${counter}${ext}`;
        destinationPath = path.join(destinationDir, newName);
        counter++;
      }
      
      // Move file
      await fs.rename(file.path, destinationPath);
      processedCount++;
      
      // Delete original if requested and file was moved
      if (deleteOriginals && file.path !== destinationPath) {
        try {
          await fs.unlink(file.path);
        } catch (deleteError) {
          console.warn(`Failed to delete original ${file.path}:`, deleteError);
        }
      }
    } catch (error) {
      errorCount++;
      const errorMsg = `Error processing ${file.name}: ${error}`;
      errors.push(errorMsg);
      console.error(errorMsg);
    }
  }
  
  const message =
    errors.length > 0
      ? `Processed ${processedCount} files. Errors: ${errors.join('; ')}`
      : `Successfully processed ${processedCount} files`;
  
  return {
    success: errorCount === 0,
    message,
    processedCount,
    errorCount,
  };
};

const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};
