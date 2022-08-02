<svelte:options tag="spread-sheets" />

<script>
  export let text;
</script>

<button class="securelogin-button">{text}</button>

<style>
  /* TODO: 样式不生效 后续查查文档 */
  @import '../css/button.css';
</style>
