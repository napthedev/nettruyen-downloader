<script>
  import {
    List,
    ListGroup,
    ListItem,
    TextField,
    ProgressCircular,
    Button,
  } from "svelte-materialify";
  import { getChapImages } from "../shared/api/chap";
  import { convertToPDF } from "../shared/api/pdf";
  import { forceDownload } from "../shared/utils";

  export let chapters;
  export let comicTitle;

  const split = (arr, size) =>
    Array.from(new Array(Math.ceil(arr.length / size)), (_, i) =>
      arr.slice(i * size, i * size + size)
    );

  let actives = [...new Array(chapters.length)].map(() => false);

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

<TextField style="margin: 20px 0" outlined type="number" bind:value={groupCount}
  >Group count</TextField
>

<List class="elevation-2" style="max-height: 400px; overflow-y: auto">
  {#each split(chapters, Number(groupCount || "1")) as section, index}
    <ListGroup bind:active={actives[index]}>
      <span slot="activator">
        <div
          style="display: flex; align-items: center; justify-content: space-between;"
        >
          <span>
            {comicTitle} Part {index + 1}
          </span>
          {#if finished.includes(index)}
            <i class="bx bx-check" style="color: #2daf2d; font-size: 25px;" />
          {:else if downloading.includes(index)}
            <ProgressCircular size={25} indeterminate color="primary" />
          {:else if failed.includes(index)}
            <div style="display: flex; align-items: center;">
              <i class="bx bx-x" style="color: #ff0000; font-size: 30px;" />
              <Button
                icon
                on:click={(e) => {
                  e.stopPropagation();
                  retryDownload(section, index);
                }}
              >
                <i class="bx bx-revision" style="font-size: 20px;" />
              </Button>
            </div>
          {/if}
        </div>
      </span>
      {#each section as item}
        <ListItem style="padding-left: 30px">
          {item.title}
        </ListItem>
      {/each}
    </ListGroup>
  {/each}
</List>

<div style="display: flex; justify-content: flex-end; margin-top: 20px;">
  <Button
    on:click={handleDownload}
    class={loading ? "" : "primary-color"}
    disabled={loading}>Download now</Button
  >
</div>
