import ReactMarkdown from 'react-markdown';

export type MarkdownProps = {
  children?: string;
  className?: string;
  markdown?: string;
};

export const Markdown = ({ children, className, markdown }: MarkdownProps) => {
  const source = markdown ?? children ?? '';

  return (
    <div className={className}>
      <ReactMarkdown>{source}</ReactMarkdown>
    </div>
  );
};
