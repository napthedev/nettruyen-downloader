<script>
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

<div class="list" style="max-height: 400px; overflow-y: auto; margin: 0;">
  {#each chapters as chap, index (chap.url)}
    <div style="display: flex;" disabled={loading}>
      <input
        style="flex-shrink: 0;"
        class="input-checkbox"
        type="checkbox"
        id="checkbox-{index}"
        bind:group={values}
        value={index}
      />
      <label style="flex-grow: 1;" for="checkbox-{index}">{chap.title}</label>
    </div>
  {/each}
</div>

<div style="display: flex; justify-content: flex-end; margin-top: 20px;">
  {#if loading}
    <div style="display: flex; align-items: center; gap: 10px">
      <svg
        style="height: 30px; width: 30px"
        class="circular-progress"
        viewBox="25 25 50 50"
      >
        <circle cx="50" cy="50" r="20" />
      </svg>
      <span style="color: #1e90ff;"> Downloading... </span>
    </div>
  {:else}
    <button
      on:click={handleDownload}
      disabled={values.length === 0}
      class="btn-primary">Download selected</button
    >
  {/if}
</div>
