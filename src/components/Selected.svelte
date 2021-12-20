<script>
  import {
    List,
    ListItem,
    Checkbox,
    ListItemGroup,
    Button,
    ProgressCircular,
  } from "svelte-materialify";
  import { getChapImages } from "../shared/api/chap";
  import { convertToPDF } from "../shared/api/pdf";
  import { forceDownload } from "../shared/utils";

  export let chapters;
  export let comicTitle;

  let values = [];
  let loading = false;

  const handleDownload = async () => {
    loading = true;

    const urls = chapters
      .map((chap) => chap.url)
      .filter((_, index) => values.includes(index));

    const images = (
      await Promise.all(urls.map((url) => getChapImages(url)))
    ).reduce((prev, current) => [...prev, ...current.images], []);

    const converted = await convertToPDF(
      images,
      `${comicTitle} ${values
        .sort((a, b) => a - b)
        .map((i) => i + 1)
        .join(",")}`
    );

    console.log(converted);

    forceDownload(converted.downloadUrl);

    loading = false;
  };
</script>

<List class="elevation-1" style="max-height: 400px; overflow-y: auto">
  <ListItemGroup multiple bind:value={values}>
    {#each chapters as chap, index (chap.url)}
      <ListItem disabled={loading}>
        <span slot="prepend">
          <Checkbox checked={values.includes(index)} />
        </span>
        {chap.title}
      </ListItem>
    {/each}
  </ListItemGroup>
</List>

<div style="display: flex; justify-content: flex-end; margin-top: 20px;">
  {#if loading}
    <div style="display: flex; align-items: center; gap: 8px">
      <ProgressCircular indeterminate />
      <span style="color: #1976d2;">Loading...</span>
    </div>
  {:else}
    <Button
      on:click={handleDownload}
      disabled={values.length === 0}
      class={values.length === 0 ? "" : "primary-color"}
      >Download selected</Button
    >
  {/if}
</div>
