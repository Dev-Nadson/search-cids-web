type Button = {
    name?: string
}

function Button(props: Button) {
    return <button>{props.name || "cli"}</button>
}

export { Button }