<script>
  import { Button } from "svelte-materialify";
  import { useNavigate } from "svelte-navigator";
  const navigate = useNavigate();
</script>

<div>
  <img src="/error.png" alt="" />
  <p class="text-h4">Something went wrong</p>
  <Button class="blue white-text" on:click={() => navigate("/")}>
    Return Home
  </Button>
</div>

<style>
  div {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  img {
    width: 100vw;
    max-width: 350px;
  }
</style>
