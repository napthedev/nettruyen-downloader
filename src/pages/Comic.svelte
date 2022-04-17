<script>
  import { getComicInfo } from "../shared/api/comic";
  import Loading from "../components/Loading.svelte";
  import Error from "../components/Error.svelte";
  import Manual from "../components/Manual.svelte";
  import Selected from "../components/Selected.svelte";
  import Automation from "../components/Automation.svelte";
  import { useNavigate } from "svelte-navigator";

  export let id;
  export let section;

  const navigate = useNavigate();

  $: section && navigate(`/${id}/${section}`);

  if (!["manual", "selected", "automation"].includes(section)) {
    navigate(`/${id}/automation`);
  }
</script>

<main>
  {#await getComicInfo(id)}
    <Loading />
  {:then data}
    <div class="flex justify-center my-6">
      <div class="w-[95vw] max-w-[500px] mx-5">
        <div class="flex gap-[10px] mb-5">
          <img
            class="w-[120px] h-[160px] object-cover"
            src={data.cover}
            alt=""
          />
          <div>
            <p class="text-lg">Download {data.title}</p>

            <div class="flex flex-wrap gap-[10px]">
              <div>
                <input
                  bind:group={section}
                  type="radio"
                  id="manual-radio"
                  value="manual"
                />
                <label for="manual-radio">Manual</label>
              </div>
              <div>
                <input
                  bind:group={section}
                  type="radio"
                  id="selected-radio"
                  value="selected"
                />
                <label for="selected-radio">Selected</label>
              </div>
              <div>
                <input
                  bind:group={section}
                  type="radio"
                  id="automation-radio"
                  value="automation"
                />
                <label for="automation-radio">Automation</label>
              </div>
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
