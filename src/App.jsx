// App.js
import React from 'react';
import ServicesSummary from './ServicesSummary';

function App({ data }) {
	const style = {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	};

	return (
		<div style={style}>
			<ServicesSummary data={data} />
		</div>
	);
}

export default App;
