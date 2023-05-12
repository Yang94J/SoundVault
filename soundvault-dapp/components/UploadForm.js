export default function UploadForm({cbs}){

    const submit = async() => {
        console.log("submitting ...");
        const musicName = document.getElementById("musicname").value;
        const musicDescription = document.getElementById("description").value;
        const music = document.getElementById("file-upload").files[0];
        const prices = document.getElementsByName('prices');
        let price;
        for (let i = 0; i < prices.length; i++) {
          if (prices[i].checked) {
            price = (prices[i].id.split(" ")[0]);
          }
        }
        const params = {
            "musicName" : musicName,
            "musicDescription" : musicDescription,
            "musicFile" : music,
            "musicPrice" : price
        }
        await cbs.upload(params);
    }

    return (
        <div className=" flex items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed top-[60px] left-[600px]  transform overflow-auto rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">

                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Create Music</h3>
                        <form>
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-4">
                                    <label htmlFor="musicname" className="block text-sm font-medium leading-6 text-gray-900">MusicName</label>
                                    <div className="mt-2">
                                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                            <input type="text" name="musicname" id="musicname" autoComplete="musicname" className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="plz input your music name here" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-full">
                                <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">description</label>
                                <div className="mt-2">
                                    <textarea id="description" name="about" rows="3" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        placeholder="plz input the description of your music here"
                                    >
                                    </textarea>
                                </div>
                            </div>

                            <div className="col-span-full">
                                <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">Music Upload</label>
                                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                    <div className="text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8.927 17.687l-.125 1c-2.648-.756-4.731-2.839-5.488-5.488l1-.125c.682 2.195 2.418 3.93 4.613 4.613zm2.073 2.313c-4.963 0-9-4.038-9-9s4.037-9 9-9 9 4.038 9 9l-.008.15c.695.141 1.354.382 1.965.701.022-.282.043-.564.043-.851 0-6.075-4.925-11-11-11s-11 4.925-11 11 4.925 11 11 11c.287 0 .569-.021.852-.043-.32-.611-.561-1.27-.701-1.965l-.151.008zm0-6c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3zm0-1c1.103 0 2-.897 2-2s-.897-2-2-2-2 .897-2 2 .897 2 2 2zm-1.818 2.646c-1.293-.508-2.319-1.534-2.827-2.827l-1.025.128c.6 1.746 1.979 3.125 3.725 3.724l.127-1.025zm14.818 2.854c0 3.037-2.463 5.5-5.5 5.5s-5.5-2.463-5.5-5.5 2.463-5.5 5.5-5.5 5.5 2.463 5.5 5.5zm-3 1.5h-5v1h5v-1zm0-1l-2.5-3-2.5 3h5zm-5.354-9.818l1.025-.128c-.6-1.746-1.979-3.125-3.725-3.725l-.128 1.025c1.293.508 2.32 1.535 2.828 2.828zm3.041-.38c-.756-2.649-2.839-4.732-5.488-5.489l-.125 1c2.195.682 3.931 2.418 4.613 4.613l1-.124z"/></svg>
                                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                                <span>Upload your music here</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                            </label>
                                            <p className="pl-1"> via clicking</p>
                                        </div>
                                        <p className="text-xs leading-5 text-gray-600">up to 20MB</p>
                                    </div>
                                </div>
                            </div>

                            <fieldset>
                                <legend className="text-sm font-semibold leading-6 text-gray-900">Price Settings</legend>
                                <p className="mt-1 text-sm leading-6 text-gray-600">You can select price in terms of tokens</p>
                                <div className="mt-6 space-y-6">
                                    <div className="flex items-center gap-x-3">
                                        <input id="1 Token" name="prices" type="radio" className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                                        <label htmlFor="1 Token" className="block text-sm font-medium leading-6 text-gray-900">1 Token</label>
                                    </div>
                                    <div className="flex items-center gap-x-3">
                                        <input id="3 Token" name="prices" type="radio" className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                                        <label htmlFor="3 Token" className="block text-sm font-medium leading-6 text-gray-900">3 Token</label>
                                    </div>
                                    <div className="flex items-center gap-x-3">
                                        <input id="5 Token" name="prices" type="radio" className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                                        <label htmlFor="5 Token" className="block text-sm font-medium leading-6 text-gray-900">5 Token</label>
                                    </div>
                                </div>
                            </fieldset>                       
                        </form>
                    </div>
                </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button type="button" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto" onClick={submit}>Submit</button>
                    <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" onClick={cbs.close}>Cancel</button>
                </div>
            </div>
        </div>
    )

}
