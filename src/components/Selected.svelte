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

<div class="max-h-[400px] overflow-y-auto overflow-x-hidden border">
  {#each chapters as chap, index (chap.url)}
    <label
      for="checkbox-{index}"
      class="flex items-center p-2 gap-2 border cursor-pointer"
      disabled={loading}
    >
      <input
        class="flex-shrink-0"
        type="checkbox"
        id="checkbox-{index}"
        bind:group={values}
        value={index}
      />
      <span class="flex-grow" for="checkbox-{index}">{chap.title}</span>
    </label>
  {/each}
</div>

<div class="flex justify-end mt-[20px]">
  {#if loading}
    <div class="flex items-center gap-[10px]">
      <div
        class="h-7 w-7 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin"
      />
      <span class="text-[#1e90ff]"> Downloading... </span>
    </div>
  {:else}
    <button
      on:click={handleDownload}
      disabled={values.length === 0}
      class="bg-blue-500 outline-none rounded text-white py-2 px-4 hover:brightness-110 transition duration-300 disabled:brightness-90"
      >Download selected</button
    >
  {/if}
</div>
