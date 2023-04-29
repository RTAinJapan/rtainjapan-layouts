/** 文字列の改行文字をbrタグとして置換する */
export const newlineString = (title: string | undefined | null) => {
	if (!title) return null;
	const lines = title.split("\\n");
	const renderTitle: React.ReactElement[] = [];
	for (let i = 0; i < lines.length; i++) {
		renderTitle.push(<span key={`main${i}`}>{lines[i]}</span>);
		if (i !== lines.length - 1) {
			renderTitle.push(<br key={`br${i}`} />);
		}
	}
	return renderTitle;
};
