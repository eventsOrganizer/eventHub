export const fetchImages = async (category: string, numberOfImages: number) => {
    fetch(`https://api.unsplash.com/search/photos?query=${category}&per_page=${numberOfImages}&client_id=${process.env.accessKey}`)
    .then(response => response.json())
    .then(data => {
      const imageUrls = data.results.map((image:any) => image.urls.regular);
      console.log("imageUrls",category,imageUrls);
      return imageUrls;
    })

    .catch(error => {
      console.error('Error fetching images:', error);
    });
}