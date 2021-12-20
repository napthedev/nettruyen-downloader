<script>
  import { getChapImages } from "../shared/api/chap";
  import { convertToPDF } from "../shared/api/pdf";
  import { forceDownload } from "../shared/utils";

  export let chapters;
  export let comicTitle;

  const split = (arr, size) =>
    Array.from(new Array(Math.ceil(arr.length / size)), (_, i) =>
      arr.slice(i * size, i * size + size)
    );

  let groupCount = "5";

  let loading = false;

  let downloading = [];

  let finished = [];
  let failed = [];

  const handleDownload = async () => {
    loading = true;

    let sections = split(chapters, Number(groupCount || "1"));

    for (let i = 0; i < sections.length; i++) {
      try {
        const section = sections[i];

        downloading = [...downloading, i];

        const images = (
          await Promise.all(section.map((chap) => getChapImages(chap.url)))
        ).reduce((prev, current) => [...prev, ...current.images], []);

        const converted = await convertToPDF(
          images,
          `${comicTitle} Part ${i + 1}`
        );

        console.log(converted);

        forceDownload(converted.downloadUrl);

        finished = [...finished, i];
      } catch (error) {
        console.log(error);
        failed = [...failed, i];
      }
    }
  };

  const retryDownload = async (section, index) => {
    try {
      failed = failed.filter((item) => item !== index);
      downloading = [...downloading, index];

      const images = (
        await Promise.all(section.map((chap) => getChapImages(chap.url)))
      ).reduce((prev, current) => [...prev, ...current.images], []);

      const converted = await convertToPDF(
        images,
        `${comicTitle} Part ${index + 1}`
      );

      console.log(converted);

      forceDownload(converted.downloadUrl);

      finished = [...finished, index];
    } catch (error) {
      failed = [...failed, index];
    }
  };
</script>

<div style="margin: 20px 0;">
  <label for="group-count">Group Count: </label>
  <input
    style="outline: none; transition: 0.3s; padding: 5px 10px;"
    id="group-count"
    name="group-count"
    class="input-outline"
    bind:value={groupCount}
    type="number"
  />
</div>

<div style="max-height: 400px; overflow-y: auto; border: 2px solid #f0f0f0">
  {#each split(chapters, Number(groupCount || "1")) as section, index}
    <div style="margin: 0;" class="collapse" tabindex="0">
      <div class="collapse-head">
        {comicTitle} Part {index + 1}
        {#if finished.includes(index)}
          <i class="bx bx-check" style="color: #2daf2d; font-size: 25px;" />
        {:else if downloading.includes(index)}
          <svg
            style="height: 25px; width: 25px;"
            class="circular-progress"
            viewBox="25 25 50 50"
          >
            <circle cx="50" cy="50" r="20" />
          </svg>
        {:else if failed.includes(index)}
          <div style="display: flex; align-items: center;">
            <i class="bx bx-x" style="color: #ff0000; font-size: 30px;" />
            <i
              on:click={(e) => {
                e.stopPropagation();
                retryDownload(section, index);
              }}
              class="bx bx-revision"
              style="font-size: 20px;"
            />
          </div>
        {/if}
      </div>
      <div class="collapse-content">
        <div class="list" style="border: none; margin: 0;">
          {#each section as item}
            <div style="padding-left: 25px">
              {item.title}
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/each}
</div>

<div style="display: flex; justify-content: flex-end; margin-top: 20px;">
  <button on:click={handleDownload} class="btn-primary" disabled={loading}
    >Download now</button
  >
</div>

<style>
  .collapse-head:hover {
    transform: scale(1) !important;
  }
  .collapse-head:focus {
    transform: scale(1) !important;
  }
</style>
