<script>
  import { getChapImages } from "../shared/api/chap";
  import { convertToPDF } from "../shared/api/pdf";
  import { forceDownload } from "../shared/utils";

  export let chapters, comicTitle;

  let loading = [];
  let completed = [];

  const removeFromLoading = (id) =>
    (loading = loading.filter((item) => item !== id));

  const handleClick = async (chap) => {
    try {
      if (!loading.includes(chap.url) && !completed.includes(chap.url)) {
        loading = [...new Set([...loading, chap.url])];

        const { images } = await getChapImages(chap.url);

        const converted = await convertToPDF(
          images,
          `${comicTitle} ${chap.title}`
        );

        console.log(converted);

        removeFromLoading(chap.url);

        forceDownload(converted.downloadUrl);

        completed = [...new Set([...completed, chap.url])];
      }
    } catch (error) {
      console.log(error);
      removeFromLoading(chap.url);
    }
  };
</script>

<div class="max-h-[400px] overflow-y-auto overflow-x-hidden border">
  {#each chapters as chap (chap.url)}
    <div
      class="flex justify-between items-center cursor-pointer p-2 border"
      on:click={() => handleClick(chap)}
    >
      <span>
        {chap.title}
      </span>
      {#if loading.includes(chap.url)}
        <div
          class="h-5 w-5 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin"
        />
      {:else if completed.includes(chap.url)}
        <i class="bx bx-check text-xl cursor-pointer text-[#2daf2d]" />
      {:else}
        <i class="bx bxs-download text-xl cursor-pointer" />
      {/if}
    </div>
  {/each}
</div>
