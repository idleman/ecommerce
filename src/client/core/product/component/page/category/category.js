/**
 * Construct the product category page
 */
import createSelectorFactory from 'evoozer/createSelectorFactory';
import getProductCategory from '../../../data/getProductCategory/factory';
import getProductItemIdsByCategoryId from '../../../data/getProductItemIdsByCategoryId/factory';
import getProductItem from '../../../data/getProductItem/factory';

import "./category.less";

export default [
  'view',
  'router/link',
  '/theme/page',
  'store/view/connect',
  function constructCategoryPage(View, Link, Page, connect) {

    const ImagePlaceholder = () => (<div className="component-product-item-list-image-placeholder"><span>No picture</span></div>);

    const ProductItem = ({ name, amount, currency, productItemId }) => {
      const href = `/product/${productItemId}`;
      return (
        <Link href={href}>
          <ImagePlaceholder />
          <strong>{name} {amount} {currency}</strong>
        </Link>
      )
    };


    const mapStateToProductListFactory = createSelectorFactory(
      [ getProductItem ],
      ( productItem ) => {
        const name = productItem.get('name');
        const amount = productItem.get('amount');
        const currency = productItem.get('currency');

        return {
          name,
          amount,
          currency
        };
      }
    );

    const mapStateToProductItem = () => mapStateToProductListFactory();
    const ProductItemContainer = connect(mapStateToProductItem, null, null, { pure: false })(ProductItem);

    class ProductList extends View.Component {
      render() {
        const { productItemIds = [] } = this.props;
        const items = productItemIds.map(productItemId => (<li><ProductItemContainer productItemId={productItemId} /></li>));
        return (
          <ul className="component-product-item-list">{items}</ul>
        );
      }
    }



    class CategoryPage extends View.Component {

      render() {
        const { name = '', description = '', productItemIds = [] } = this.props;
        const paragraphs = description
          .split('\n\n')
          .map(paragraph => (<p>{paragraph}</p>));

        return (
          <Page>
            <h1>{name}</h1>
            {paragraphs}
            <hr />
            <ProductList productItemIds={productItemIds} />
          </Page>
        );
      }

    }

    const mapStateToPropsFactory = createSelectorFactory(
      [ getProductCategory, getProductItemIdsByCategoryId ],
      ( productCategory, productItemIds) => {
        const name = productCategory.get('name');
        const description = productCategory.get('description');

        return {
          name,
          description,
          productItemIds
        };
      }
    );

    const mapStateToProps = () => mapStateToPropsFactory();
    return connect(mapStateToProps, null, null, { pure: false })(CategoryPage);
  }
];