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
    id="group-count"
    name="group-count"
    class="outline-none border-gray-300 focus:border-blue-500 border-2 rounded-md transition duration-300 px-2"
    bind:value={groupCount}
    type="number"
  />
</div>

<div class="max-h-[400px] overflow-y-auto overflow-x-hidden border">
  {#each split(chapters, Number(groupCount) <= 0 ? 1 : Number(groupCount)) as section, index}
    <div class="group m-0" tabindex="0">
      <div class="p-2 border cursor-pointer flex justify-between items-center">
        {comicTitle} Part {index + 1}
        {#if finished.includes(index)}
          <div class="flex items-center">
            <i class="bx bx-check text-[#2daf2d] text-2xl" />
            <i
              on:click={(e) => {
                e.stopPropagation();
                retryDownload(section, index);
              }}
              class="bx bx-revision text-xl"
            />
          </div>
        {:else if failed.includes(index)}
          <div class="flex items-center">
            <i class="bx bx-x text-red-500 text-3xl" />
            <i
              on:click={(e) => {
                e.stopPropagation();
                retryDownload(section, index);
              }}
              class="bx bx-revision text-xl"
            />
          </div>
        {:else if downloading.includes(index)}
          <div
            class="h-5 w-5 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin"
          />
        {/if}
      </div>
      <div class="group-focus-within:h-auto h-0 overflow-y-hidden">
        <div>
          {#each section as item}
            <div class="pl-5">
              {item.title}
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/each}
</div>

<div class="flex justify-end mt-[20px]">
  <button
    on:click={handleDownload}
    class="bg-blue-500 outline-none rounded text-white py-2 px-4 hover:brightness-110 transition duration-300"
    disabled={loading}>Download now</button
  >
</div>
