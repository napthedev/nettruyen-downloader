<script>
  import { API_REGEX, API_URL } from "../shared/constants";

  export let navigate;

  let inputValue = "";
  let hasError = false;
  let errorMessage = `${API_URL}/truyen-tranh/id`;
  const handleFormSubmit = () => {
    if (API_REGEX.test(inputValue)) {
      navigate(`/${inputValue.split("/").slice(-1)[0]}`);
    } else {
      hasError = true;
    }
  };
</script>

<form
  class="min-h-screen flex flex-col items-center justify-center gap-[10px]"
  on:submit|preventDefault={handleFormSubmit}
>
  <img class="w-[100px] h-[100px]" src="/logo.png" alt="" />
  <p class="text-2xl">NetTruyen Comic Downloader</p>
  <div>
    <input
      bind:value={inputValue}
      type="text"
      class="outline-none border-gray-300 focus:border-blue-500 border-2 rounded-md transition duration-300 w-screen max-w-[350px] h-[50px] px-[15px]"
      placeholder="Comic URL"
      on:change={() => (hasError = false)}
      autofocus
    />
  </div>
  {#if hasError}
    <p class="text-red-500">{errorMessage}</p>
  {/if}
  <button
    type="submit"
    class="bg-blue-500 outline-none rounded text-white py-2 px-4 hover:brightness-110 transition duration-300"
    >Download the comic</button
  >
</form>
