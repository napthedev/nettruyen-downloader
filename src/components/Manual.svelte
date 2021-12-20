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

<div class="list" style="max-height: 400px; overflow-y: auto; margin: 0;">
  {#each chapters as chap (chap.url)}
    <div
      style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;"
      on:click={() => handleClick(chap)}
    >
      <span>
        {chap.title}
      </span>
      {#if loading.includes(chap.url)}
        <svg
          style="width: 20px; height: 20px;"
          class="circular-progress"
          viewBox="25 25 50 50"
        >
          <circle cx="50" cy="50" r="20" />
        </svg>
      {:else if completed.includes(chap.url)}
        <i class="bx bx-check" style="color: #2daf2d;" />
      {:else}
        <i class="bx bxs-download" />
      {/if}
    </div>
  {/each}
</div>

<style>
  i {
    font-size: 20px;
    cursor: pointer;
  }
</style>
