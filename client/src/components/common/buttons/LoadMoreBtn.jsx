const LoadMoreBtn = ({ state, fetchDataFunc, additionalParam }) => {
	if (state !== null && state.totalDocs > state.results.length) {
		return (
			<button
				onClick={() =>
					fetchDataFunc({ ...additionalParam, page: state.page + 1 })
				}
				className="chip mx-auto mt-10 px-8 py-3 hover:text-blue transition-colors"
			>
				Load More
			</button>
		)
	}
}

export default LoadMoreBtn
