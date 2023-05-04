export default function StatisticCard({data}){
    return(
            <div className='rounded-lg shadow-sm divide-y divide-zinc-600 bg-zinc-900'>
                <div className="p-6">
                    <h2 className="text-2xl leading-6 font-semibold text-white">
                        {data.name}
                    </h2>
                    <p className="mt-4 text-zinc-300">{data.description}</p>
                    <p className="mt-8">
                    <span className="text-5xl font-extrabold white">
                        {data.number}
                    </span>
                    </p>
                </div>
            </div>
    )
}

