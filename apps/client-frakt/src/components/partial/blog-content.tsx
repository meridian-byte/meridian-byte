import './blog-content.scss';

export default function BlogContent({ content }: { content: string }) {
  return (
    <div
      className="blog-content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
