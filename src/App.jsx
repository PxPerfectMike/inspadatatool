// App.js
import React from 'react';
import ServicesSummary from './ServicesSummary';

function App() {
	const style = {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	};

	return (
		<div style={style}>
			<ServicesSummary />
		</div>
	);
}

export default App;
