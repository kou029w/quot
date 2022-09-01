import "./card.css";

export default (props: { id: number; title: string; text: string }) => {
  return (
    <article class="card">
      <h2>{props.title}</h2>
      <p>{props.text.slice(props.title.length + 1)}</p>
    </article>
  );
};
