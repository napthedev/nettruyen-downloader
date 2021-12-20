<script>
  import { List, ListItem, Button, ProgressCircular } from "svelte-materialify";
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

<List class="elevation-1" style="max-height: 400px; overflow-y: auto">
  {#each chapters as chap (chap.url)}
    <ListItem on:click={() => handleClick(chap)}>
      {chap.title}
      <span slot="append">
        <Button icon>
          {#if loading.includes(chap.url)}
            <ProgressCircular indeterminate size={20} />
          {:else if completed.includes(chap.url)}
            <i class="bx bx-check" style="color: #2daf2d;" />
          {:else}
            <i class="bx bxs-download" />
          {/if}
        </Button>
      </span>
    </ListItem>
  {/each}
</List>

<style>
  i {
    font-size: 20px;
  }
</style>
