import { PageTemplate } from "../common/styles";
import LoggedInHeader from "../common/Header/LoggedInHeader"
import useShopHooks from "./shopHooks";
import { SearchInput } from "./SearchInput";
import { DataDisplay } from "./DataDisplay";
import { PromptResults } from "./PromptResults";

export const ShopPage = () => {
    const {         
        searchQuery, data, loading,
        searchByProductName, searchPrompts, handleSearchQuery, 
        displayData, showSearchPrompts, performSearch,
        filterProductByCategory, craftFilterClicked, clothingFilterClicked, 
        foodFilterClicked, othersFilterClicked
    } = useShopHooks();

    return (
        <PageTemplate>   
            <LoggedInHeader></LoggedInHeader> 
            <div>
                <SearchInput 
                    data={{
                        searchByProductName: searchByProductName,
                        searchQuery: searchQuery,
                        filterProductByCategory: filterProductByCategory,
                        filterProductByCategory: filterProductByCategory,
                        craftFilterClicked: craftFilterClicked,
                        clothingFilterClicked: clothingFilterClicked,
                        foodFilterClicked: foodFilterClicked,
                        othersFilterClicked: othersFilterClicked,
                        performSearch: performSearch
                    }}
                />

                <PromptResults
                    data={{
                        showSearchPrompts: showSearchPrompts,
                        searchPrompts: searchPrompts,
                        handleSearchQuery: handleSearchQuery
                    }}
                />

                <DataDisplay 
                    data={{ displayData: displayData }}
                />

            </div>
        </PageTemplate>
    )
}