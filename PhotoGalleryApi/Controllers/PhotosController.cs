using Microsoft.AspNetCore.Mvc;
using PhotoGalleryApi.Models;
using PhotoGalleryApi.Services;

namespace PhotoGalleryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PhotosController : ControllerBase
    {
        private readonly PhotosService _photosService;

        public PhotosController(PhotosService photosService)
        {
            _photosService = photosService;
        }

        [HttpGet]
        public ActionResult<List<Photo>> GetPhotos()
        {
            return Ok(_photosService.GetPhotos());
        }

        [HttpPost]
        public IActionResult AddPhoto([FromBody] Photo newPhoto)
        {
            _photosService.AddPhoto(newPhoto);
            return CreatedAtAction(nameof(GetPhotos), newPhoto);
        }

        [HttpPut("{id}")]
        public IActionResult UpdatePhoto(int id, [FromBody] Photo updatedPhoto)
        {
            if (id != updatedPhoto.Id)
            {
                return BadRequest();
            }
            _photosService.UpdatePhoto(updatedPhoto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeletePhoto(int id)
        {
            _photosService.DeletePhoto(id);
            return NoContent();
        }
    }
}