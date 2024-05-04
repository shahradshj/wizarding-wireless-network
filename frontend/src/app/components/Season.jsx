
export default async function Season({ season }) {
    console.log(season)
    return (
        <div>
            <h1>{`Season ${season['season']}`}</h1>
            {season['episodes'].map((episode) => (
                <p>{`S${episode.season}E${episode.episode}`}</p>
            ))}
        </div>
    )
}