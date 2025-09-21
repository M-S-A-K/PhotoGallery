using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using PhotoGalleryApi.Models;

namespace PhotoGalleryApi.Services
{
    public class PhotosService
    {
        private const string FilePath = "photos.json";

        public PhotosService()
        {
            if (!File.Exists(FilePath))
            {
                File.WriteAllText(FilePath, "[]");
            }
        }

        private List<Photo> LoadPhotos()
        {
            var json = File.ReadAllText(FilePath);
            return JsonSerializer.Deserialize<List<Photo>>(json);
        }

        private void SavePhotos(List<Photo> photos)
        {
            var json = JsonSerializer.Serialize(photos);
            File.WriteAllText(FilePath, json);
        }

        public List<Photo> GetPhotos()
        {
            return LoadPhotos();
        }

        public void AddPhoto(Photo photo)
        {
            var photos = LoadPhotos();
            photo.Id = photos.Any() ? photos.Max(p => p.Id) + 1 : 1;
            photos.Add(photo);
            SavePhotos(photos);
        }

        public void UpdatePhoto(Photo updatedPhoto)
        {
            var photos = LoadPhotos();
            var existingPhoto = photos.FirstOrDefault(p => p.Id == updatedPhoto.Id);
            if (existingPhoto != null)
            {
                existingPhoto.Url = updatedPhoto.Url;
                existingPhoto.Title = updatedPhoto.Title;
                SavePhotos(photos);
            }
        }

        public void DeletePhoto(int id)
        {
            var photos = LoadPhotos();
            var photoToRemove = photos.FirstOrDefault(p => p.Id == id);
            if (photoToRemove != null)
            {
                photos.Remove(photoToRemove);
                SavePhotos(photos);
            }
        }

    }
}