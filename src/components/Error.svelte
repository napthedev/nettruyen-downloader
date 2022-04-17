<script>
  import { Link } from "svelte-navigator";
</script>

<div class="min-h-screen flex justify-center items-center flex-col gap-2">
  <img class="w-full max-w-[200px] h-auto" src="/error.png" alt="" />
  <p class="text-2xl">Something went wrong</p>
  <Link class="text-blue-400" to="/">Return Home</Link>
</div>
