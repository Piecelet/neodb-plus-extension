export const neodbAlbumPageCreate = () => {
    // Unavailable until authorization system is implemented
    
    // const AccessToken = "Your NeoDB ACCESS_TOKEN"; // Visit https://neodb.social/developer/ for details about obtaining an Access Token

    // // NeoDB Album Page Create Btn
    // if (window.location.href.startsWith("https://neodb.social/album/")) {
    //   const box = document.getElementById("item-cover");
    //   box.style.position = "relative";
    
    //   const CreateBtn = document.createElement("button");
    //   const svgIcon1 = `
    //   <svg width="20" height="20" viewBox="0 0 28 28" fill="#008000" xmlns="http://www.w3.org/2000/svg">
    // <path xmlns="http://www.w3.org/2000/svg" d="M15 6C15 5.44772 14.5523 5 14 5C13.4477 5 13 5.44772 13 6V13H6C5.44772 13 5 13.4477 5 14C5 14.5523 5.44772 15 6 15H13V22C13 22.5523 13.4477 23 14 23C14.5523 23 15 22.5523 15 22V15H22C22.5523 15 23 14.5523 23 14C23 13.4477 22.5523 13 22 13H15V6Z"/>
    //   </svg>`;
    //   CreateBtn.innerHTML = svgIcon1;
    //   CreateBtn.style.backgroundColor = "#E2ECE2";
    //   CreateBtn.style.width = "28px";
    //   CreateBtn.style.height = "28px";
    //   CreateBtn.style.borderRadius = "6px";
    //   CreateBtn.style.padding = "0";
    //   CreateBtn.style.border = "none";
    //   CreateBtn.style.position = "absolute";
    //   CreateBtn.style.top = "-64px";
    //   CreateBtn.style.left = "36px";
    //   CreateBtn.style.display = "flex";
    //   CreateBtn.style.alignItems = "center";
    //   CreateBtn.style.justifyContent = "center";
    //   box.appendChild(CreateBtn);
    
    //   CreateBtn.addEventListener("click", async () => {
    //     const albumId = window.location.pathname.split("/").pop();
    
    //     try {
    //       const response = await fetch(
    //         `https://neodb.social/api/album/${albumId}`,
    //         {
    //           headers: {
    //             Authorization: AccessToken,
    //           },
    //         },
    //       );
    //       const albumData = await response.json();
    
    //       // Download cover image
    //       if (albumData.cover_image_url) {
    //         downloadImage(
    //           albumData.cover_image_url,
    //           `${albumData.title}_cover.jpg`,
    //         );
    //       } else {
    //         console.log("No cover image URL found in the album data.");
    //       }
    
    //       // Send the album data to the background script
    //       chrome.runtime.sendMessage({
    //         action: "fillDoubanForm",
    //         albumData: albumData,
    //       });
    //     } catch (error) {
    //       console.error("Failed to fetch album data:", error);
    //     }
    //   });
    
    //   // Function to download image
    //   function downloadImage(url, fileName) {
    //     const a = document.createElement("a");
    //     a.style.display = "none";
    //     a.href = url;
    //     a.download = fileName;
    //     document.body.appendChild(a);
    //     a.click();
    //     document.body.removeChild(a);
    //   }
    // }
};
