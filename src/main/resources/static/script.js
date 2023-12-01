function FileUpload() {
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        // Check if a file has been selected
        const fileInput = form.querySelector('input[type="file"]');
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            alert('Please select a file');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
            });

            if (response.ok) {
                const contentDisposition = response.headers.get('Content-Disposition');
                const filename = contentDisposition.split(';')[1].split('=')[1].trim().replace(/"/g, '');

                const blob = await response.blob();
                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                throw new Error('Conversion failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Conversion failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>DOC TO PDF</h1>
            <form id="fileForm" action="/convert" method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
                <input type="file" name="file" accept=".doc, .docx" required /> {/* Add 'required' attribute for HTML5 validation */}
                <button type="submit" disabled={loading}>
                    {loading ? 'Converting to PDF...' : 'Convert to PDF'}
                </button>
            </form>
        </div>
    );
}

ReactDOM.render(<FileUpload />, document.getElementById('root'));
