const NodataMessage = ({ message }) => {
    return (
        <div className="text-center w-full p-6 rounded-bubble bg-white shadow-soft text-muted font-medium mt-4">
            <p>{message}</p>
        </div>
    )
}

export default NodataMessage
