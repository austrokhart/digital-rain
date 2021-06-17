class Element {
  type: 'void' | 'head' | 'body' | 'tail';

  content?: string;

  opacity?: number;

  constructor(props: {
    type: Element['type'];
    content?: Element['content'];
    opacity?: Element['opacity'];
  }) {
    const { type, content, opacity } = props;

    this.type = type;
    this.content = content;
    this.opacity = opacity;
  }
}

export default Element;
