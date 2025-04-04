document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("simulBtn").addEventListener("click", function() {
        simulData();
    });
});

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("file").addEventListener("change", function() {

        function displayTable(data, tableIds) {
			
			const table = document.getElementById(tableIds);
            
            var rowCount = table.rows.length;
			for (var i = rowCount - 1; i > 0; i--) {
				table.deleteRow(i);
			}
            
            // Create table rows
            for (let i = 0; i < data.length; i++) {
                const row = document.createElement('tr');
                data[i].forEach(cell => {
                    const td = document.createElement('td');
                    td.textContent = cell;
                    row.appendChild(td);
                });
                table.appendChild(row);
            }
        }

        function parseCSV(data) {
            const rows = data.split('\n');
            return rows.map(row => row.split(','));
        }
        
        const file = event.target.files[0];
        
        if (file) {
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const contents = e.target.result;
                const fdata = parseCSV(contents);
                displayTable(fdata, 'resultTable');
            };
            reader.readAsText(file);
        }
    });
});
