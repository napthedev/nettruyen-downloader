<script>
  import { Radio } from "svelte-materialify";
  import { getComicInfo } from "../shared/api/comic";
  import Loading from "../components/Loading.svelte";
  import Error from "../components/Error.svelte";
  import Manual from "../components/Manual.svelte";
  import Selected from "../components/Selected.svelte";
  import Automation from "../components/Automation.svelte";

  export let id;
  export let section;
  export let navigate;

  $: section && navigate(`/${id}/${section}`);

  if (!["manual", "selected", "automation"].includes(section)) {
    navigate(`/${id}/automation`);
  }
</script>

<main>
  {#await getComicInfo(id)}
    <Loading />
  {:then data}
    <div class="container">
      <div style="width: 100vw; max-width: 500px; margin: 20px;">
        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
          <img src={data.cover} alt="" />
          <div>
            <p>Download {data.title}</p>

            <div style="display: flex; flex-wrap: wrap; gap: 10px">
              <Radio bind:group={section} value="manual">Manual</Radio>
              <Radio bind:group={section} value="selected">Selected</Radio>
              <Radio bind:group={section} value="automation">Automation</Radio>
            </div>
          </div>
        </div>

        {#if section === "manual"}
          <Manual chapters={data.chapters} comicTitle={data.title} />
        {:else if section === "selected"}
          <Selected chapters={data.chapters} comicTitle={data.title} />
        {:else}
          <Automation chapters={data.chapters} comicTitle={data.title} />
        {/if}
      </div>
    </div>
  {:catch}
    <Error />
  {/await}
</main>

<style>
  .container {
    display: flex;
    justify-content: center;
  }

  img {
    width: 100px;
    height: 150px;
    object-fit: cover;
  }
</style>
