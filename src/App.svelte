<script>
  import { MaterialApp } from "svelte-materialify";
  import { Router, Route } from "svelte-navigator";
  import Comic from "./pages/Comic.svelte";
  import Home from "./pages/Home.svelte";
</script>

<MaterialApp>
  <Router>
    <Route path="/" component={Home} />
    <Route path="/:id" component={Comic} />
    <Route path="/:id/:section" component={Comic} />
  </Router>
</MaterialApp>
